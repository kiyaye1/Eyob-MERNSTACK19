import * as actionTypes from "../ActionTypes";

const initialState = {
    notifications: [],
    unreadCount: 0,
};

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_NOTIFICATIONS:
            return {
                ...state,
                notifications: [
                    ...state.notifications,
                    ...action.payload.map(notif => ({
                        ...notif,
                        read: notif.read ?? false,
                    })),
                ],
                unreadCount: state.notifications.filter(n => !n.read).length + action.payload.filter(n => !n.read).length,
            };

        case actionTypes.MARK_NOTIFICATION_READ:
            return {
                ...state,
                notifications: state.notifications.map((notification) =>
                    notification.id === action.payload
                        ? { ...notification, read: true }
                        : notification
                ),
                unreadCount: Math.max(state.unreadCount - 1, 0),
            };

        case actionTypes.RESET_STATIC_NOTIFICATIONS_ON_LOGIN:
            return {
                ...state,
                notifications: action.payload, 
                unreadCount: action.payload.filter(n => !n.read).length,
            };

        case actionTypes.CLEAR_NOTIFICATIONS_ON_LOGOUT:
            return {
                ...state,
                notifications: [],
                unreadCount: 0,
            };

        default:
            return state;
    }
};

export default notificationReducer;