module default {
    type Permission {
        required property name -> str;
    }

    type User {
        required property username -> str;
        required property password -> str;
        required property email -> str;
        required property token -> str;
        link permission -> Permission;
        multi link friends -> User{
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

    type Password_Reset {
        required property urlToken -> str;
        required property email -> str;
    }

    type Notification {
        required property name -> str;
        required property text -> str;
        required property date -> datetime;
        required property seen -> bool { 
            default := false 
        };
    }
}