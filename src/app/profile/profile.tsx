import { useEffect, useState } from "react";
import { usersApi } from "@/api/users";
import useAuthStore from "@/store/authStore";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    if (currentUser?._id) {
      usersApi.getById(currentUser._id)
        .then((data) => setUser(data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div style={{ padding: 32 }}>
      <h1>Profile</h1>
      <img src={user.avatar} alt="Avatar" style={{ width: 120, borderRadius: "50%" }} />
      <h2>{user.username}</h2>
      <p>{user.bio}</p>
      <p>Email: {user.email}</p>
      {/* Add more profile fields as needed */}
    </div>
  );
}
