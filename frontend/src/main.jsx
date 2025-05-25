import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe("pk_test_51RRGpb4TlNLOi1wDBWv49MxdCsS8b9L67bECP3aJhNHfktZyeokyiu9FOja4mizB9KTOnHv2AQJhIwbokr7OpQlv00fWK2Acyg");


createRoot(document.getElementById('root')).render(
  

  <Elements stripe={stripePromise}>
           <BrowserRouter>
            <App />
           </BrowserRouter>
    </Elements>
)
