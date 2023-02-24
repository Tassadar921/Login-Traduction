CREATE MIGRATION m1j7jw5fjvnwz2fgpwzvuhrgep7wwcejnfvtd2d2royls4qukonjqa
    ONTO m1xuaso5fvmv3akfawzbgkq3vbstjckpzeqrp5krupcc3bpjsvjpaa
{
  ALTER TYPE default::Notification {
      ALTER PROPERTY name {
          RENAME TO title;
      };
  };
};
