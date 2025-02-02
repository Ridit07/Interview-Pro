const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.recordInterruptedAction = functions.https.onRequest(
    async (req, res) => {
      try {
        const reportData = req.body;

        // Add to Firestore collection
        await admin.firestore().collection("recordingReports").add({
          interviewId: reportData.interviewId,
          action: reportData.action,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(200).send("Report saved successfully");
      } catch (error) {
        console.error("Error saving report:", error);
        res.status(500).send("Error saving report");
      }
    },
);
