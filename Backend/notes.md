

## REFUND POLICY
what if i make system to refund 80 % and if user doesnot request refund and also doesnot checksin i send notification for user to check in or cancle 1 hr befor 24 hr then i give money to owner and update the status of room to checksin. and if user wants refund , i validate by getting reason and send the message to owner and if he verifies refund else return refund not valid to user and send money to owner (while validating refund deny from owner , ask for room photo for evidence it should match with the room they posted)


## Booking Process 
 - user clicks book room.
 - room status change to reserved.
 - user redirect to payment page.
 - user make payment.
 - if success then room status change to booked.keep money in escrow for 24 hours.
 - else room status change to available.
 - if booked then send notification to owner and notification to user.
 - if user cancles booking before checksin in 24 hours then send evidence to room owner and ask for verification of refund.
 - if verified, room status change to available and refund money.
 - else ask for proof that it is checked in by same user already if true then give money to owner and room status change to checkedin.
 - else room status change to available and give money to user and send notification to both.
# FACET
Stage	        What It Does            	        Example Use Case

$match	        Filters documents 🎯	            { price: { $gte: 100 } } to get expensive items
$group	        Groups by a field & applies 
                aggregations                        { _id: "$category", count: { $sum: 1 } } to count items   per category
$bucket	        Divides values into fixed ranges 	{ boundaries: [0, 50, 100], groupBy: "$price" }
$bucketAuto	    Same as $bucket, but auto-fits
                ranges Useful when you don’t know
                exact boundaries
$facet	        Runs multiple pipelines in parallel    { total: [ { $count: "totalDocs" } ], avgPrice: [ {                                                     $group: {...} } ] }
$unwind	    Flattens arrays into multiple documents	
            Converts { tags: ["A", "B"] } → { tags: "A" }, { tags: "B" }
$count	    Counts total documents at that stage 	      { $count: "total" } at the end to get total count

## Refund Policy

User Requests Refund → Admin Reviews → Notify Owner → Owner Responds → 
   ↓                               ↓
Approve → Release Escrow → Notify User    Reject → Save Reason/Photos → Notify User



- i make a function that sends money according to the reffund status [Approved----> send to user,RejectedByAdmin --->send to Owner]
- when owner approves,refund status:approved, 
- when owner rejects, refund status: rejectedByOwner[in this should provide photos and reason]
- now i see the reason and photos of each refund collection if it is genieune, i send the money to the owner
I use 
//for code, make md 

```javascript

 refundSchema.pre("save", async function (next) {
         if(!this.isModified("status")){
            next();
        }else{
            //here call the function for payment
            //function(this)
            next(); 
        }
         });

```

### Payment Modle

- When user clicks book in room booking creates then room status change to reserved.
- this creates payment model.(where the data needed for esewa payment is sent as response)
- these data is used in frontEnd to make a payment request.
- Redirects to Esewa payment page.
- remember i may need to send html response for esewa payment page when user clicks book.
- User makes payment.
- Esewa sends Response,if Sucess,it is redirected to success page where i make a patch request with transaction uuid [it is set in backend as query parameter in sucess_url] of the payment to handleSucess where status is modified to success.
- then,if the the status is modified,change the status of the room to booked & status of payment is sucess.(get roomid from payment model).
- else room status change to available.

  
## Notification Occasions

# NOTE : this all notification are made in each corresponding controllers

### 1. When a payment is updated
- **Receiver:** Current user
- **roomId:** `payment.roomId`
- **paymentId:** `payment._id`
- **Message:** `payment.status`

### 2. When a booking is made
- **Receiver:** Current user, `booking.room.ownerId`
- **roomId:** `booking.roomId`
- **bookingId:** `booking._id`
- **Message:** `booking.status`

### 3. When a booking is updated
- **Receiver:** Current user, `booking.room.ownerId`
- **roomId:** `booking.roomId`
- **bookingId:** `booking._id`
- **Message:** `booking.status`

### 4. When a review is made
- **Receiver:** Current user, `review.room.ownerId`
- **roomId:** `review.roomId`
- **reviewId:** `review._id`
- **Message:** `review.rating`

### 5. When a report is made
- **Receiver:** Current user, admin
- **roomId:** `report.roomId`
- **reportId:** `report._id`
- **Message:** `report.reason`

### 6. When a roommate request is sent
- **Receiver:** `roommateRequest.receiver`
- **Message:** `roommateRequest.sender` sent you a roommate request

### 7. When a roommate request is accepted
- **Receiver:** `roommateRequest.sender`
- **Message:** `roommateRequest.receiver` accepted your roommate request

### 8. When a roommate request is rejected
- **Receiver:** `roommateRequest.sender`
- **Message:** `roommateRequest.receiver` rejected your roommate request

### 10. When a roommate is registered
- **Receiver:** `roommate.userId`
- **Message:** Welcome Mr. `roommate.fullName`

### 11. When a registration is made
- **Receiver:** Current user
- **Message:** Welcome Mr. `user.fullName`

### 12. When a message is sent
- **Receiver:** `message.receiver`
- **Message:** `message.sender` sent you a message

### 13. When a room is listed
- **Receiver:** `room.ownerId`
- **Message:** `room.name` is listed on RoomBazar

### 14. When a refund is requested
- **Receiver:** `refund.userId`
- **Message:** `refund.status`

### 15. When a refund is approved
- **Receiver:** `refund.userId`
- **Message:** `refund.status`

### 16. When a refund is rejected
- **Receiver:** `refund.userId`
- **Message:** `refund.status`

### 17. When a favorite is added
- **Receiver:** `favorite.userId`
- **Message:** `favorite.status`   

# In react in frontEnd, i use the useEffect with sending get request for fetching count and display at notifications menu and when notification is clicked,make get request first and then patch req to update isread?


# in Refund.controllers.js and on payment.controllers.js, watch out for payment EndPoints