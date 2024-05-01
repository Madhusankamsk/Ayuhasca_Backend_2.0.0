import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import addMomentRoutes from './routes/addMomentRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { CronJob } from 'cron';
import User from './models/userModel.js';
import Event from './models/eventModel.js';
import { Expo } from 'expo-server-sdk';

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/events', addMomentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/report', reportRoutes);

new CronJob('0 8 * * *', async function () {
  console.log('You will see this message every minute');

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
  const formattedDate = formatDate(tomorrow);

  console.log(formattedDate);

  const events = await Event.find({ date: formattedDate });

  events.forEach(async (event) => {
    const sendNotification = async (user, messageBody) => {
      const userNotificationToken = await User.findById(user).select('notificationtoken');
      if (userNotificationToken && userNotificationToken.notificationtoken) {
        console.log('Sending notification to user:', userNotificationToken.notificationtoken);
        const messages = [
          {
            to: userNotificationToken.notificationtoken,
            sound: 'default',
            body: messageBody,
            data: { withSome: 'data' },
          },
        ];

        const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
        const chunks = expo.chunkPushNotifications(messages);
        const tickets = [];

        for (const chunk of chunks) {
          try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
          } catch (error) {
            console.error(error);
          }
        }
      } else {
        console.log('Notification token not found or empty for user:', user);
      }
    };

    event.going.forEach(async (user) => {
      const messageBody = `You have an event on ${event.date}! ${event.eventname} at ${event.time}`;
      await sendNotification(user, messageBody);
    });

    event.interested.forEach(async (user) => {
      const messageBody = `You have an interested event on ${event.date}! ${event.eventname} at ${event.time}`;
      await sendNotification(user, messageBody);
    });
  });
}, null, true, 'Asia/Kolkata');

if (process.env.NODE_ENV === 'development') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname,'index.html'))
  );
} else {
  app.get('/api', (req, res) => {
    res.send('API is running....Development!');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));