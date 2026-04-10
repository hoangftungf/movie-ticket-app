const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

/**
 * Cloud Function: Gui notification nhac lich chieu phim
 * Chay moi 5 phut, kiem tra ve nao sap chieu trong 30 phut toi
 */
exports.sendShowtimeReminders = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    console.log('Checking for upcoming showtimes...');

    const now = new Date();
    const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000);
    const thirtyFiveMinutesLater = new Date(now.getTime() + 35 * 60 * 1000);

    try {
      // Lay tat ca ve chua gui notification
      const ticketsSnapshot = await db.collection('tickets')
        .where('status', '==', 'confirmed')
        .where('reminderSent', '==', false)
        .get();

      if (ticketsSnapshot.empty) {
        console.log('No tickets to process');
        return null;
      }

      const notifications = [];

      for (const ticketDoc of ticketsSnapshot.docs) {
        const ticket = ticketDoc.data();

        // Parse showtime
        const showDate = ticket.showDate; // "2024-04-10"
        const showTime = ticket.showtime; // "14:30"
        const showDateTime = new Date(`${showDate}T${showTime}:00`);

        // Kiem tra neu showtime trong khoang 30-35 phut toi
        if (showDateTime >= thirtyMinutesLater && showDateTime <= thirtyFiveMinutesLater) {
          // Lay FCM token cua user
          const userDoc = await db.collection('users').doc(ticket.userId).get();

          if (userDoc.exists && userDoc.data().fcmToken) {
            const fcmToken = userDoc.data().fcmToken;

            // Tao notification message
            const message = {
              notification: {
                title: 'Sap den gio chieu phim!',
                body: `Phim "${ticket.movieTitle}" se chieu luc ${ticket.showtime} tai ${ticket.theaterName}. Con 30 phut nua!`,
              },
              data: {
                ticketId: ticketDoc.id,
                movieTitle: ticket.movieTitle,
                showtime: ticket.showtime,
                type: 'showtime_reminder'
              },
              token: fcmToken
            };

            notifications.push({
              message,
              ticketId: ticketDoc.id
            });
          }
        }
      }

      // Gui tat ca notifications
      for (const item of notifications) {
        try {
          await messaging.send(item.message);
          console.log(`Sent notification for ticket ${item.ticketId}`);

          // Danh dau da gui notification
          await db.collection('tickets').doc(item.ticketId).update({
            reminderSent: true,
            reminderSentAt: admin.firestore.FieldValue.serverTimestamp()
          });
        } catch (error) {
          console.error(`Error sending notification for ticket ${item.ticketId}:`, error);
        }
      }

      console.log(`Processed ${notifications.length} notifications`);
      return null;
    } catch (error) {
      console.error('Error in sendShowtimeReminders:', error);
      return null;
    }
  });

/**
 * Cloud Function: Gui notification khi dat ve thanh cong
 * Trigger khi co ve moi trong collection tickets
 */
exports.onTicketCreated = functions.firestore
  .document('tickets/{ticketId}')
  .onCreate(async (snap, context) => {
    const ticket = snap.data();
    const ticketId = context.params.ticketId;

    console.log(`New ticket created: ${ticketId}`);

    try {
      // Lay FCM token cua user
      const userDoc = await db.collection('users').doc(ticket.userId).get();

      if (!userDoc.exists || !userDoc.data().fcmToken) {
        console.log('User has no FCM token');
        return null;
      }

      const fcmToken = userDoc.data().fcmToken;

      // Gui notification xac nhan dat ve
      const message = {
        notification: {
          title: 'Dat ve thanh cong!',
          body: `Ban da dat ve xem phim "${ticket.movieTitle}" luc ${ticket.showtime} tai ${ticket.theaterName}`,
        },
        data: {
          ticketId: ticketId,
          movieTitle: ticket.movieTitle,
          showtime: ticket.showtime,
          type: 'booking_confirmation'
        },
        token: fcmToken
      };

      await messaging.send(message);
      console.log(`Sent booking confirmation for ticket ${ticketId}`);

      // Cap nhat ticket voi reminderSent = false (chua gui nhac lich)
      await snap.ref.update({
        reminderSent: false
      });

      return null;
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      return null;
    }
  });

/**
 * HTTP Function: Test gui notification
 * Dung de test push notification
 */
exports.testNotification = functions.https.onRequest(async (req, res) => {
  const { userId, title, body } = req.query;

  if (!userId) {
    res.status(400).send('Missing userId');
    return;
  }

  try {
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists || !userDoc.data().fcmToken) {
      res.status(404).send('User not found or no FCM token');
      return;
    }

    const message = {
      notification: {
        title: title || 'Test Notification',
        body: body || 'Day la thong bao test tu Cloud Functions',
      },
      token: userDoc.data().fcmToken
    };

    const response = await messaging.send(message);
    res.send(`Notification sent: ${response}`);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`Error: ${error.message}`);
  }
});
