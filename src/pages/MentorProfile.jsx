import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '@clerk/clerk-react';

const MentorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);

  useEffect(() => {
    fetchMentorProfile();
    if (isSignedIn && user) {
      checkConnectionStatus();
    }
  }, [id, isSignedIn, user]);

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/users/profile?email=${user.primaryEmailAddress.emailAddress}`
      );
      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.connectedMentors?.includes(id));
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
    }
  };

  const fetchMentorProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = `http://localhost:5001/api/users/mentors/${id}`;
      console.log('Fetching mentor profile from:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch mentor profile');
      }

      const data = await response.json();
      if (!data) {
        throw new Error('No data received from server');
      }
      
      console.log('Mentor profile data:', data);
      setMentor(data);
    } catch (error) {
      console.error('Error fetching mentor profile:', error.message);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setConnectLoading(true);
      const response = await fetch('http://localhost:5001/api/users/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menteeEmail: user.primaryEmailAddress.emailAddress,
          mentorId: id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to connect with mentor');
      }

      const connectedMentors = await response.json();
      setIsConnected(connectedMentors.some(mentorId => mentorId === id));
      toast.success('Successfully connected with mentor!');
    } catch (error) {
      console.error('Error connecting with mentor:', error);
      toast.error(error.message);
    } finally {
      setConnectLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setConnectLoading(true);
      const response = await fetch('http://localhost:5001/api/users/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menteeEmail: user.primaryEmailAddress.emailAddress,
          mentorId: id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to disconnect from mentor');
      }

      const connectedMentors = await response.json();
      setIsConnected(connectedMentors.some(mentorId => mentorId === id));
      toast.success('Successfully disconnected from mentor!');
    } catch (error) {
      console.error('Error disconnecting from mentor:', error);
      toast.error(error.message);
    } finally {
      setConnectLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-600 dark:text-gray-300">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500 dark:text-red-400">{error}</div>;
  if (!mentor) return <div className="text-center py-12 text-gray-600 dark:text-gray-300">Mentor not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/mentors')}
            className="px-4 py-2 bg-gray-200 dark:bg-dark-content text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-dark-content-light"
          >
            Back to Mentors
          </button>
          {isSignedIn && (
            <button
              onClick={isConnected ? handleDisconnect : handleConnect}
              disabled={connectLoading}
              className={`px-6 py-2 rounded-lg ${
                isConnected
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {connectLoading
                ? 'Processing...'
                : isConnected
                ? 'Disconnect'
                : 'Connect'}
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-dark-secondary shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{mentor.username}'s Profile</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {mentor.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Educational Background</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <strong>Education:</strong> {mentor.education || 'Not set'}
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  <strong>College:</strong> {mentor.college || 'Not set'}
                </p>
                {mentor.mentorInfo && (
                  <>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      <strong>Degree:</strong> {mentor.mentorInfo.degree || 'Not set'}
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      <strong>Institution:</strong> {mentor.mentorInfo.institution || 'Not set'}
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      <strong>Years of Experience:</strong> {mentor.mentorInfo.yearsOfExperience || 'Not set'}
                    </p>
                  </>
                )}
              </div>
              {mentor.mentorInfo?.bio && (
                <div className="sm:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bio</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{mentor.mentorInfo.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;