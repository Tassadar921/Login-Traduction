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
        multi link friends -> User;
    }

    type User_Creation {
        required property urlToken -> str;
        required property username -> str;
        required property email -> str;
        required property password -> str;
    }

    type Password_Reset {
        required property token -> str;
        required property email -> str;
    }
}