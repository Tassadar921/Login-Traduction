module default {
    type Permission {
        required property name -> str;
    }

    abstract type Subject {}

    type User extending Subject {
        required property username -> str;
        required property password -> str;
        required property email -> str;
        required property token -> str;
        link permission -> Permission;
        multi link friends -> User{
            on target delete allow;
        };
        multi link blocked -> User{
            on target delete allow;
        };
        multi link pendingFriendsRequests -> User {
            on target delete allow;
        };
        multi link notifications -> Notification {
            on target delete allow;
            on source delete delete target;
        };
    }

    type User_Creation {
        required property urlToken -> str;
        required property username -> str;
        required property email -> str;
        required property password -> str;
    }

    type Reset_Password {
        required property urlToken -> str;
        required property email -> str;
    }

    type Notification {
        required property component -> str;
        multi link object -> Subject {
            on target delete allow;
        };
        required property date -> datetime;
        required property seen -> bool {
            default := false;
        };
    }

    type Message extending Subject {
        required property text -> str;
        required property date -> datetime;
        required property seen -> bool { 
            default := false;
        };
        link sender -> User {
            on target delete delete source;
        };
        multi link receiver -> User {
            on target delete allow;
        };
    }
}