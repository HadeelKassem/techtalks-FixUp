function StarRate({value,onChange,readOnly=false}){

return (
    <div className="star">
        {[1,2,3,4,5].map((star)=> (
<button key={star} type ="button" className={`star ${star <= value ? 'filled':''}`}
onClick={()=> !readOnly && onChange(star)}
disabled={readOnly}
>★
</button>
    ))} </div>
)}

export default StarRate