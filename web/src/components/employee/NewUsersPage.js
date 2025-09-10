import React, { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import user1 from '../../assets/user1.png';
import user2 from '../../assets/user2.png';
import user3 from '../../assets/user3.png';
import user4 from '../../assets/user-avatar.png';

const initialNewUsers = [
  { id: 1, name: "Lisa Anderson", email: "lisa.a@example.com", timestamp: "2 minutes ago", status: "Pending", avatar: user1 },
  { id: 2, name: "Tom Rodriguez", email: "tom.r@example.com", timestamp: "15 minutes ago", status: "Pending", avatar: user2 },
  { id: 3, name: "James Brown", email: "james.b@example.com", timestamp: "3 hours ago", status: "Approved", avatar: user3 },
  { id: 4, name: "Maria Garcia", email: "maria.g@example.com", timestamp: "1 day ago", status: "Pending", avatar: user4 },
  { id: 5, name: "David Wilson", email: "david.w@example.com", timestamp: "2 days ago", status: "Denied", avatar: user2 },
];

const NewUsersPage = () => {
  const [newUsers, setNewUsers] = useState(initialNewUsers);

  const handleApprove = (userId) => {
    setNewUsers(users => users.map(user => user.id === userId ? { ...user, status: 'Approved' } : user));
  };

  const handleDeny = (userId) => {
    setNewUsers(users => users.map(user => user.id === userId ? { ...user, status: 'Denied' } : user));
  };

  return (
    <div className="employee-dashboard-content">
      <div className="list-wrapper-emp">
        <div className="list-header">
          <h3>New User Registrations</h3>
          <p>Approve or deny new users waiting for access.</p>
        </div>
        <ul className="client-list full-page-list">
          {newUsers.map(user => (
            <li key={user.id}>
              <img src={user.avatar} alt={user.name} />
              <div className="user-details">
                <h4>{user.name}</h4>
                <p>{user.email} &bull; {user.timestamp}</p>
              </div>
              <div className="action-buttons-wrapper">
                {user.status === 'Pending' && (
                  <>
                    <button className="btn-deny" onClick={() => handleDeny(user.id)}><FaTimes /> Deny</button>
                    <button className="btn-approve" onClick={() => handleApprove(user.id)}><FaCheck /> Approve</button>
                  </>
                )}
                {user.status === 'Approved' && <span className="status-pill approved">Approved</span>}
                {user.status === 'Denied' && <span className="status-pill denied">Denied</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NewUsersPage;