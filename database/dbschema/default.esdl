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
}