CREATE MIGRATION m1iz7knwpn5lrrk5u2jkjhhgq33xydqyfzb2vivfxe2hczyd5gyica
    ONTO m1vq3cgwqpfzpolufkguovu7j66pswtnipxxyrn2h5lmy4yqoccyaq
{
  ALTER TYPE default::User {
      DROP PROPERTY birthdate;
      DROP PROPERTY firstname;
      DROP PROPERTY lastname;
  };
};
