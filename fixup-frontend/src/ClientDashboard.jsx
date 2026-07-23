import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProviders,
  getMyBookings,
  clearSession
} from "./api";

import "./ClientDashboard.css";



function StarRating({ value }) {

  const rounded = Math.round(value || 0);

  return (
    <span className="star-rating">
      {"★".repeat(rounded)}
      {"☆".repeat(5-rounded)}
    </span>
  );

}



function bookingStatusClass(status){

  return (status || "")
    .toLowerCase()
    .replaceAll(" ","-")
    .replaceAll("_","-");

}




function ProviderCard({provider}){
  const navigate = useNavigate();
  return (

    <div className="provider-card">


      <div className="provider-card-top">


        <div className="provider-avatar">

          {
            provider.name?.charAt(0)?.toUpperCase() || "?"
          }

        </div>


        <div>


          <div className="provider-name-row">

            <span className="provider-name">
              {provider.name}
            </span>


            {
              provider.isVerified &&
              <span className="verified-badge">
                ✓
              </span>
            }


          </div>


          <StarRating value={provider.avgRating}/>


        </div>


      </div>



      {
        provider.bio &&
        <p className="provider-bio">
          {provider.bio}
        </p>
      }



      <div className="provider-meta">


        {
          provider.skills &&
          <span className="meta-chip">
            {provider.skills}
          </span>
        }


        {
          provider.serviceArea &&
          <span className="meta-chip">
            {provider.serviceArea}
          </span>
        }


      </div>
      <button
  onClick={() => navigate(`/providers/${provider.id}`)}
>
  View Profile
</button>


    </div>

  );

}




function BookingRow({booking}){

return (

<div className="booking-row">


<div className="booking-main">

<span className="booking-provider">
{booking.providerName}
</span>


<span className="booking-category">
{booking.categoryName}
</span>


</div>



<div className="booking-details">

<span>
{booking.location}
</span>


{
booking.preferredDate &&
<span>
 · {booking.preferredDate}
</span>
}


</div>



{
booking.notes &&
<p className="booking-notes">
{booking.notes}
</p>
}



<span className={`status-badge ${bookingStatusClass(booking.status)}`}>

{booking.status}

</span>



</div>

);


}





function ClientDashboard({user,onLogout}){


const navigate = useNavigate();


const [tab,setTab]=useState("feed");

const [providers,setProviders]=useState([]);

const [books,setBooks]=useState([]);


const [loadingFeed,setLoadingFeed]=useState(true);

const [loadingHistory,setLoadingHistory]=useState(true);


const [feedError,setFeedError]=useState("");

const [historyError,setHistoryError]=useState("");


const [menuOpen,setMenuOpen]=useState(false);




useEffect(()=>{


getProviders()

.then(setProviders)

.catch(err=>
setFeedError(
err.message || "Couldn't load providers"
)
)

.finally(()=>
setLoadingFeed(false)
);




getMyBookings()

.then(setBooks)

.catch(err=>
setHistoryError(
err.message || "Couldn't load bookings"
)
)

.finally(()=>
setLoadingHistory(false)
);



},[]);






function handleLogout(){

clearSession();

onLogout?.();

}






return (

<div className="client-shell">



<header className="client-topbar">



<div className="client-brand">

Fix<span>Up</span>

</div>




<nav className="client-tabs">


<button

className={
tab==="feed"
?
"client-tab is-active"
:
"client-tab"
}

onClick={()=>
setTab("feed")
}

>

Providers

</button>



<button

className={
tab==="history"
?
"client-tab is-active"
:
"client-tab"
}

onClick={()=>
setTab("history")
}

>

Request History

</button>

<button
  type="button"
  className="client-tab"
  onClick={() => navigate("/client/chat")}
>
  Chat
</button>

<button
  type="button"
  className="client-tab"
  onClick={() => navigate("/client/live-location")}
>
  Live Location
</button>

</nav>





<div className="profile-menu-wrap">


<button

className="profile-icon-btn"

onClick={()=>
setMenuOpen(!menuOpen)
}

>

{
user?.email?.charAt(0)?.toUpperCase()
||
"U"
}

</button>





{
menuOpen &&

<div className="profile-menu">


<button

onClick={()=>{

navigate("/client/profile");

setMenuOpen(false);

}}

>

Profile

</button>



<button onClick={handleLogout}>

Log out

</button>



</div>

}



</div>




</header>






<main className="client-page-wrap">



{
tab==="feed" &&

<section>


<h1 className="section-title">

Available providers

</h1>



{
loadingFeed &&
<p className="muted">
Loading providers...
</p>
}



{
feedError &&
<div className="server-error">
{feedError}
</div>
}



<div className="provider-grid">


{
providers.map(provider=>

<ProviderCard

key={provider.id}

provider={provider}

/>

)

}



</div>



</section>

}






{
tab==="history" &&


<section>


<h1 className="section-title">

Your request history

</h1>




{
loadingHistory &&
<p className="muted">

Loading requests...

</p>

}




{
historyError &&
<div className="server-error">

{historyError}

</div>
}





<div className="booking-list">


{
books.map(booking=>

<BookingRow

key={booking.id}

booking={booking}

/>

)

}



</div>




</section>


}



</main>



</div>


);



}



export default ClientDashboard;