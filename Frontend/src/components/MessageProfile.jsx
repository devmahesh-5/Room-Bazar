import React,{useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import messageService from '../services/message.services';
import{MessageCard} from '../components/index.js';
function MessageProfile({
    children,
    className = ''
}) {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ;(async () => {
            try {
                const messageProfile = await messageService.getMessageProfile();
                if (messageProfile) {
                    setProfiles(messageProfile.data);
                }
            } catch (error) {
                throw error
            } finally {
                setLoading(false);
            }
        })();
    },[]);

    if (!Array.isArray(profiles) || profiles.length === 0) {
        return (<div className="w-1/3 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold">No profiles found</h2>
    </div>);
      } else {
        return (
            <div className="w-1/3 p-4 bg-[#F2F4F7] rounded-lg">
            <h2 className="text-lg font-semibold">Contacts</h2>
            {profiles.map((profile) => (
              <MessageCard
                key={profile.user._id}
                _id={profile.user._id}
                avatar={profile.user.avatar}
                fullName={profile.user.fullName}
              />
            ))}
          </div>
        );
      }
      
    
}

export default MessageProfile
