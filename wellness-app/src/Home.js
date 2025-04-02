import React from 'react';
import './Home.css'; // Optional, if you want to include custom styles

function Home() {
  return (
    <div className="home-page" style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to the Wellness Clinic Dashboard</h1>
      <p>
        Manage patients, practitioners, appointments, staff, and schedules all in one place.
      </p>
      <p>
        Access detailed reports and analytics to monitor the clinic's performance and stay on top of daily operations.
      </p>
      <p>
        Use the navigation menu above to explore the different sections of the dashboard.
      </p>
    </div>
  );
}

export default Home;
