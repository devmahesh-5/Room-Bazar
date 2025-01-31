

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