import * as actionTypes from "../ActionTypes";

// Add notifications
export const addNotifications = (notifications) => ({
    type: actionTypes.ADD_NOTIFICATIONS,
    payload: Array.isArray(notifications) ? notifications : [notifications],
});

// Mark notifications as read
export const markNotificationRead = (id) => ({
    type: actionTypes.MARK_NOTIFICATION_READ,
    payload: id,
});

// Reset only unread static notifications when a user logs in (without resetting read ones)
export const resetStaticNotificationsOnLogin = () => (dispatch, getState) => {
    const existingNotifications = getState().notificationReducer.notifications;

    const updatedNotifications = existingNotifications.map((notif) =>
        notif.static && !notif.read ? { ...notif, read: false } : notif
    );

    dispatch({
        type: actionTypes.RESET_STATIC_NOTIFICATIONS_ON_LOGIN,
        payload: updatedNotifications,
    });
};

// Clear notifications on logout
export const clearNotificationsOnLogout = () => ({
    type: actionTypes.CLEAR_NOTIFICATIONS_ON_LOGOUT,
});

// Add static notifications only if they don’t already exist (without resetting read ones)
export const addStaticNotificationsOnLogin = () => (dispatch, getState) => {
    const existingNotifications = getState().notificationReducer.notifications;

    const staticNotifications = [
        { id: 103, message: "Browse and add products to your cart!", static: true, read: false },
        { id: 102, message: "Check product reviews before purchasing", static: true, read: false }, 
        { id: 101, message: "Review your cart before checkout!", static: true, read: false },
    ];

    // Prevent adding static notifications if they already exist
    const newNotifications = staticNotifications.filter(
        notif => !existingNotifications.some(n => n.id === notif.id)
    );

    if (newNotifications.length > 0) {
        dispatch(addNotifications(newNotifications));
    }
};