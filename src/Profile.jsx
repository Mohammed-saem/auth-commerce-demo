import { signOut } from 'firebase/auth'
import { auth } from './firebase'
import { useNavigate } from 'react-router-dom'

const Profile = () => {

    const navigate = useNavigate()

const handleSingout = ()=>{
     signOut(auth).then(()=>{
      alert('logout Successfully')
        navigate('/Login')
     })
}   
  const user = auth.currentUser

  return (
    <div style={{display: 'flex', flexDirection: "column", paddingTop: "50px",
       background: "linear-gradient(135deg, #5f7dac 0%, #59aa63 100%)",
    }}>


        <div style={{width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#1a1a2e", color: "white", fontSize: "32px", display: "flex", alignItems: "center", justifyContent: "center",}}>
            {user?.email[0].toUpperCase()}
        </div>
        <p  style={{display:"flex",marginLeft:"10px"}}>{user?.email}</p> 

       <div style={{width:"100%", display:"flex", flexDirection:"column",textAlign:'left',}}>
  <div style={{borderBottom: '1px solid black',borderTop:"1px solid black", padding: "12px",fontSize:"19px"}}>⚙️ Settings</div>
  <div style={{borderBottom: '1px solid black', padding: "12px",}}>🎁 Earn & Refer</div>
  <div style={{borderBottom: '1px solid black', padding: "12px"}}>📦 My Orders</div>
  <div style={{borderBottom: '1px solid black', padding: "12px"}}>❤️ Wishlist</div>
  <div style={{borderBottom: '1px solid black', padding: "12px"}}>❓ Help Center</div>
  <div style={{borderBottom: '1px solid black', padding: "12px"}}>🕐 History</div>
</div>

        

        <button onClick={handleSingout} style={{backgroundColor: "red", color: "white", padding: "10px 30px",  marginTop: "40px"}}>Singout</button>

    </div>
  )
}
 
export default Profile