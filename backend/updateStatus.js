exports.updateStatus = async (req, res) => {
  console.log(
    `-------------------updateStatus (${req.params.resID})----------------`
  );
  try {
    const { resID } = req.params;
    const { resStatus } = req.body;
    const { employeeID } = req.body;
    const { employeeName } = req.body;
    const { customerID } = req.body;
    const { salonID } = req.body;

    const io = req.app.get("io");

    console.log(
      `CustomerID: ${customerID} \n SalonID: ${salonID}, \n EmployeeID: ${employeeID}, \n EmployeeName: ${employeeName}, \n resStatus: ${resStatus}`
    );

    io.to(`customer_${customerID}`).emit("reservation:confirmRequest", {
      resID: resID,
      employeeID: employeeID,
      employeeName: employeeName,
      message: `Do you want to confirm your reservation with ${employeeName}?`,
    });
    io.on(
      "reservation:confirmResponse",
      async ({ resID, employeeID, confirmed }) => {
        console.log(
          "reservation:confirmResponse",
          resID,
          employeeID,
          confirmed
        );
        if (confirmed) {
          console.log("Reservation cancelled by customer");
          io.to(`employee_${employeeID}`).emit("reservation:confirmed", {
            resID,
            employeeID,
            confirmed: false,
          });
        } else {
          console.log("Reservation confirmed by customer");
          io.to(`employee_${employeeID}`).emit("reservation:rejected", {
            resID,
            employeeID,
            confirmed: true,
          });
          return;
        }
      }
    );
    // const query = `UPDATE reservation SET resStatus = ? WHERE resID = ?`;
    // const [result] = await db.query(query, [resStatus, resID]);
    // if (result.affectedRows > 0) {
    //   const updatedReservationQuery = `
    //   SELECT
    //   r.resID,
    //   r.resDate,
    //   r.customerID,
    //   r.resTime,
    //   r.resStatus,
    //   s.salonName,
    //   s.phone AS salonPhone,
    //   GROUP_CONCAT(sv.serviceName) AS reservedServices,
    //   SUM(sv.servicePrice) AS totalPrice
    //   FROM reservation r
    //   JOIN salon s ON r.salonID = s.salonID
    //   JOIN reservation_service rs ON r.resID = rs.resID
    //   JOIN service sv ON rs.serviceID = sv.serviceID
    //   WHERE r.resID = ?
    //   GROUP BY r.resID, r.resDate, r.resTime, r.resStatus, s.salonName, s.phone
    //   ORDER BY r.resDate ASC, r.resTime ASC
    // `;
    //   const [updatedRows] = await db.query(updatedReservationQuery, [resID]);
    //   if (updatedRows.length > 0) {
    //     const customerID = updatedRows[0].customerID;
    //     console.log("checking customerID: " + customerID);
    //     console.log(`checking salonID: ${salonID}`);
    //     io.to(`customer_${customerID}`).emit("reservation:statusUpdate", {
    //       resID: updatedRows[0].resID,
    //       resDate: updatedRows[0].resDate,
    //       resTime: updatedRows[0].resTime,
    //       customerName: updatedRows[0].customerName,
    //       customerPhone: updatedRows[0].customerPhone,
    //       reservedServices: updatedRows[0].reservedServices,
    //       totalPrice: updatedRows[0].totalPrice,
    //       salonName: updatedRows[0].salonName,
    //       salonPhone: updatedRows[0].salonPhone,
    //       resStatus: updatedRows[0].resStatus,
    //     });
    //     io.to(`salon_${salonID}`).emit("reservation:statusUpdate", {
    //       resID: updatedRows[0].resID,
    //       resDate: updatedRows[0].resDate,
    //       resTime: updatedRows[0].resTime,
    //       customerName: updatedRows[0].customerName,
    //       customerPhone: updatedRows[0].customerPhone,
    //       reservedServices: updatedRows[0].reservedServices,
    //       totalPrice: updatedRows[0].totalPrice,
    //       salonName: updatedRows[0].salonName,
    //       salonPhone: updatedRows[0].salonPhone,
    //       resStatus: updatedRows[0].resStatus,
    //     });
    //     res.status(200).json({
    //       success: true,
    //       message: "Reservation status updated successfully",
    //     });
    //     console.log("Updated reservation data: ", updatedRows[0]);
    //   } else {
    //     console.log("No updated reservation data found for resID: " + resID);
    //   }

    //   console.log("Reservation status updated successfully");
    // } else {
    //   res.status(404).json({
    //     success: false,
    //     message: "No reservation found with resID: " + resID,
    //   });
    //   console.log("No reservation found with resID: " + resID);
    // }
  } catch (error) {
    return returnServerErrorMessage(res, error);
  }
};
