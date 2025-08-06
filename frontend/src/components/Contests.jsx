// frontend/src/components/Contests.jsx
import React from 'react';
import { Trophy, Calendar, Clock, Link } from 'lucide-react';

function Contests({ userRole, isAuthenticated }) {
    // Placeholder contest data
    const contests = [
        {
            id: 1,
            name: "Codeforces Round (Div. 1 + Div. 2)",
            platform: "Codeforces",
            startTime: "7/8/2025, 8:05:00 PM",
            endTime: "7/8/2025, 11:05:00 PM",
            duration: "3.00 hours",
            link: "#"
        },
        {
            id: 2,
            name: "Codeforces Round (Div. 1)",
            platform: "Codeforces",
            startTime: "31/7/2025, 8:05:00 PM",
            endTime: "31/7/2025, 10:05:00 PM",
            duration: "2.00 hours",
            link: "#"
        },
        {
            id: 3,
            name: "Codeforces Round (Div. 2)",
            platform: "Codeforces",
            startTime: "27/7/2025, 8:05:00 PM",
            endTime: "27/7/2025, 10:05:00 PM",
            duration: "2.00 hours",
            link: "#"
        },
        {
            id: 4,
            name: "LeetCode Weekly Contest 300",
            platform: "LeetCode",
            startTime: "8/1/2025, 7:30:00 PM",
            endTime: "8/1/2025, 9:00:00 PM",
            duration: "1.50 hours",
            link: "#"
        }
    ];

    return (
        <div className="bg-dark min-vh-100 py-5">
            <div className="container">
                <header className="bg-dark text-white p-4 mb-5 rounded-3 border-bottom border-info border-3">
                    <h1 className="h3 fw-bold mb-0 d-flex align-items-center">
                        <Trophy size={28} className="me-2 text-warning" /> Upcoming Coding Contests
                    </h1>
                    <p className="text-muted">Stay updated with the latest competitive programming events.</p>
                </header>

                {contests.length === 0 ? (
                    <div className="text-center text-muted py-5 border border-secondary rounded-3 card-themed">
                        <p className="mb-0 fs-5">No upcoming contests found.</p>
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {contests.map(contest => (
                            <div className="col" key={contest.id}>
                                <div className="card card-themed shadow-sm rounded-3 h-100 border-secondary">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title text-light fw-bold mb-2">{contest.name}</h5>
                                        <p className="card-text text-muted small mb-3">{contest.platform}</p>
                                        <ul className="list-unstyled text-light small mb-3 flex-grow-1">
                                            <li className="d-flex align-items-center mb-1">
                                                <Calendar size={14} className="me-2 text-info" />
                                                Start: {contest.startTime}
                                            </li>
                                            <li className="d-flex align-items-center mb-1">
                                                <Calendar size={14} className="me-2 text-info" />
                                                End: {contest.endTime}
                                            </li>
                                            <li className="d-flex align-items-center">
                                                <Clock size={14} className="me-2 text-info" />
                                                Duration: {contest.duration}
                                            </li>
                                        </ul>
                                        <div className="d-grid mt-auto">
                                            <a href={contest.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline-info rounded-pill d-flex align-items-center justify-content-center py-2">
                                                <Link size={16} className="me-2" /> Visit Contest
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Contests;
