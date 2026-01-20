import "./profile.css";

export default function DoctorProfile({ data }) {
  const { user, profile } = data;

  return (
    <div className="card">
      <div className="left-container">
        <img src="/log2.png" alt="" />
        <h2 className="gradienttext">
          {profile.firstName} {profile.lastName}
        </h2>
        <a href="/profile/edit" className="btn">Change</a>
        <a href="/services" className="btn">Home</a>
      </div>

      <div className="right-container">
        <h3 className="gradienttext">Profile Details</h3>
        <table>
          <tbody>
            <tr><td>Email:</td><td>{user.email}</td></tr>
            <tr><td>Specialization:</td><td>{profile.specialization}</td></tr>
            <tr><td>Category:</td><td>{profile.category}</td></tr>
            <tr><td>Department:</td><td>{profile.department}</td></tr>
            <tr><td>Info:</td><td>{profile.info}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
