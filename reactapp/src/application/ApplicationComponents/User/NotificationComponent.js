import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markNotificationRead } from "../../State/Notification/NotificationActions";
import { useNavigate } from "react-router-dom";

const NotificationComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const { notifications } = useSelector((state) => state.notificationReducer);

    // Sort notifications (newest first)
    const sortedNotifications = [...notifications].sort((a, b) => {
        if (!a.read && b.read) return -1; 
        if (a.read && !b.read) return 1; 
        return b.id - a.id; 
    });

    // Count only unread notifications
    const unreadCount = notifications.filter((notif) => !notif.read).length;

    const handleNotificationClick = (id, message) => {
        const notification = notifications.find((notif) => notif.id === id);

        if (notification && !notification.read) {
            dispatch(markNotificationRead(id));
        }

        // Navigate based on the notification message
        if (message.includes("Browse")) navigate("/product");
        else if (message.includes("sing")) navigate("/product");
        else if (message.includes("out")) navigate("/cart");
        else if (message.includes("Total")) navigate("/cart");
        else if (message.includes("Leave")) navigate("/recent-orders");
        else if (message.includes("Reorder")) navigate("/recent-orders");
    };

    return (
        <div
            style={{ position: "relative", display: "inline-block", marginLeft: "20px" }}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
        >
            <button style={{ position: "relative", fontSize: "22px", background: "none", border: "none", cursor: "pointer" }}>
                🔔
                {unreadCount > 0 && (
                    <span
                        style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                            backgroundColor: "red",
                            color: "white",
                            borderRadius: "50%",
                            padding: "3px 7px",
                            fontSize: "12px",
                        }}
                    >
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div
                    style={{
                        position: "absolute",
                        top: "35px",
                        right: "0",
                        background: "white",
                        border: "1px solid #ccc",
                        width: "250px",
                        padding: "10px",
                        borderRadius: "5px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                        zIndex: 1000,
                    }}
                >
                    {/*<h4>Notifications</h4>*/}
                    <ul style={{ listStyle: "none", padding: "0", maxHeight: "200px", overflowY: "auto" }}>
                        {sortedNotifications.length > 0 ? (
                            sortedNotifications.map((notif) => (
                                <li
                                    key={notif.id}
                                    style={{
                                        padding: "10px",
                                        borderBottom: "1px solid #ddd",
                                        cursor: "pointer",
                                        backgroundColor: notif.read ? "#f1f1f1" : "#fff", 
                                        color: notif.read ? "#888" : "black",
                                    }}
                                    onClick={() => handleNotificationClick(notif.id, notif.message)}
                                >
                                    {notif.message}
                                </li>
                            ))
                        ) : (
                            <li style={{ padding: "10px", color: "#888" }}>No new notifications</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NotificationComponent;