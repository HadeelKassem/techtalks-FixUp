import StarRate from "./StarRating";

function ReviewList({reviews}){
    if(reviews.length === 0 ){
        return <p className="no-reviews ">No reviews </p>
    }
 {/** calculating avg review  */}
   const average = (

    reviews.reduce((sum,r) => sum+ r.rating, 0 )/reviews.length)

return(
<div className="review-list">
    <div className="review-summary">
        <span className="avg-score">{average}</span>
    <div>

        <StarRate value = {Math.round(average)}readOnly/>
<p>{reviews.length} review{reviews.length !== 1 ? 's':''}</p>

</div>
</div>
<hr></hr>
{/* Reviews per user */}
{reviews.map((review)=>(<div className="review-card" key={review.id}>
          <div className="review-header">
            <div className="reviewer-avatar">
              {review.clientName.charAt(0)}
            </div>
            <div>
              <strong>{review.clientName}</strong>
              <p className="review-date">{review.date}</p>
            </div>
            <StarRating value={review.rating} readOnly />
          </div>
          <p className="review-comment">{review.comment}</p>
        </div>
      ))}

</div>

)

}



export default ReviewList