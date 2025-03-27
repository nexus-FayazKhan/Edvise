import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

const AVAILABLE_SKILLS = [
  'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'MongoDB',
  'SQL', 'HTML/CSS', 'TypeScript', 'AWS', 'Docker', 'Git', 'Machine Learning',
  'Data Science', 'UI/UX Design', 'DevOps', 'Agile', 'Cloud Computing'
];

const Profile = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState({
    gender: '',
    birthDate: '',
    phoneNumber: '',
    location: '',
    education: '',
    college: '',
    careerInterests: '',
    skills: [],
    role: 'mentee',
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetchUserProfile();
    }
  }, [isLoaded, isSignedIn, user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5001/api/users/profile?email=${user.primaryEmailAddress.emailAddress}`
      );
      if (response.ok) {
        const data = await response.json();
        setUserProfile({
          ...userProfile,
          ...data,
          birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
        });
      } else if (response.status === 404) {
        setUserProfile({ ...userProfile, email: user.primaryEmailAddress.emailAddress });
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUserProfile({
      ...userProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillToggle = (skill) => {
    setUserProfile((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress.emailAddress,
          ...userProfile,
        }),
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        fetchUserProfile();
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchUserProfile();
  };

  const filteredSkills = AVAILABLE_SKILLS.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isLoaded) return <div className="text-center py-12 text-gray-600 dark:text-gray-300">Loading...</div>;
  if (!isSignedIn) return <div className="text-center py-12 text-gray-600 dark:text-gray-300">Please log in to view your profile.</div>;
  if (loading) return <div className="text-center py-12 text-gray-600 dark:text-gray-300">Loading profile...</div>;
  if (error) return <div className="text-center py-12 text-red-500 dark:text-red-400">{error}</div>;

  const isProfileIncomplete = !userProfile.gender || !userProfile.birthDate || !userProfile.education;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-dark-secondary shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
              <div className="space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSubmit}
                      className="px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-5 py-2.5 bg-gray-200 dark:bg-dark-content text-gray-700 dark:text-gray-300 font-semibold rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-dark-content-light focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {isProfileIncomplete && !isEditing && (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-lg text-sm font-medium">
                Please complete your profile to get the most out of Edvise!
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={userProfile.gender}
                    onChange={handleChange}
                    className="mt-2 block w-full py-3 px-4 bg-white dark:bg-dark-tertiary border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="mt-2 text-sm text-gray-900 dark:text-gray-300">{userProfile.gender || 'Not set'}</p>
                )}
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Birth Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="birthDate"
                    value={userProfile.birthDate}
                    onChange={handleChange}
                    className="mt-2 block w-full py-3 px-4 bg-white dark:bg-dark-tertiary border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                  />
                ) : (
                  <p className="mt-2 text-sm text-gray-900 dark:text-gray-300">
                    {userProfile.birthDate ? new Date(userProfile.birthDate).toLocaleDateString() : 'Not set'}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={userProfile.phoneNumber}
                    onChange={handleChange}
                    className="mt-2 block w-full py-3 px-4 bg-white dark:bg-dark-tertiary border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                  />
                ) : (
                  <p className="mt-2 text-sm text-gray-900 dark:text-gray-300">{userProfile.phoneNumber || 'Not set'}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={userProfile.location}
                    onChange={handleChange}
                    className="mt-2 block w-full py-3 px-4 bg-white dark:bg-dark-tertiary border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                  />
                ) : (
                  <p className="mt-2 text-sm text-gray-900 dark:text-gray-300">{userProfile.location || 'Not set'}</p>
                )}
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Education</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="education"
                    value={userProfile.education}
                    onChange={handleChange}
                    className="mt-2 block w-full py-3 px-4 bg-white dark:bg-dark-tertiary border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                  />
                ) : (
                  <p className="mt-2 text-sm text-gray-900 dark:text-gray-300">{userProfile.education || 'Not set'}</p>
                )}
              </div>

              {/* College */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">College</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="college"
                    value={userProfile.college}
                    onChange={handleChange}
                    className="mt-2 block w-full py-3 px-4 bg-white dark:bg-dark-tertiary border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                  />
                ) : (
                  <p className="mt-2 text-sm text-gray-900 dark:text-gray-300">{userProfile.college || 'Not set'}</p>
                )}
              </div>

              {/* Career Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Career Interests</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="careerInterests"
                    value={userProfile.careerInterests}
                    onChange={handleChange}
                    className="mt-2 block w-full py-3 px-4 bg-white dark:bg-dark-tertiary border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                  />
                ) : (
                  <p className="mt-2 text-sm text-gray-900 dark:text-gray-300">{userProfile.careerInterests || 'Not set'}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Role</label>
                {isEditing ? (
                  <select
                    name="role"
                    value={userProfile.role}
                    onChange={handleChange}
                    className="mt-2 block w-full py-3 px-4 bg-white dark:bg-dark-tertiary border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                  >
                    <option value="mentee">Mentee (Junior)</option>
                    <option value="mentor">Mentor (Senior)</option>
                  </select>
                ) : (
                  <p className="mt-2 text-sm text-gray-900 dark:text-gray-300 flex items-center">
                    {userProfile.role === 'mentor' ? 'Mentor' : 'Mentee'}
                    {userProfile.role === 'mentor' && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Verified
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">Skills</h3>
              {isEditing && (
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 px-4 bg-white dark:bg-dark-tertiary border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 mb-6 transition-colors duration-200"
                />
              )}

              <div className="space-y-3">
                {isEditing ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {filteredSkills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center p-3 bg-gray-50 dark:bg-dark-tertiary rounded-lg hover:bg-gray-100 dark:hover:bg-dark-content transition-colors duration-200 cursor-pointer"
                        onClick={() => handleSkillToggle(skill)}
                      >
                        <input
                          type="checkbox"
                          checked={userProfile.skills.includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                          className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-200">{skill}</label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {userProfile.skills.length > 0 ? (
                      userProfile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 shadow-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No skills added yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;