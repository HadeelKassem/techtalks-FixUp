import { useState } from "react";
import StarRate from "./StarRating";

function ReviewForm({requestId, providerName ,onSubmit}){
    const [rating  , StarRating  ] = useState(0)
    const [comment , setComment  ] = useState('')
    const [submit  , setSubmit   ] = useState(false)
 }

 const handleSubmit=()=>{
  if (rating === 0 ){
    alert('Please select a proper statrt rating')
    return }

 onSubmit({requestId,rating,comment})
 setSubmit(true)
    
if(submit){
    return(<div className="Success_rate">
        Thank you for leaving a review ! 
    </div>)
}
return (
    <div className="review-form">
        <h3>Rate your experience !</h3>
        <StarRate value={rating} onChange={setRating}/>
        <div className="form-fields">
        <label>Comment</label>
        <textarea
        placeholder="leave a comment"
        value={comment}
        onChange={(e)=> setComment(e.target.value )}/>
        </div>
     <button className="primary-button submit" onClick={handleSubmit}>
        Submit
     </button>

    </div>
)

 }