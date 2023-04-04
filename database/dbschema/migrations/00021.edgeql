CREATE MIGRATION m127wvbn3lhtb5eyzhd3vf3mcvbr6i7mprq2ctfmkuoi7y4z77zjxa
    ONTO m1hhjdjzzfl6dwf66ok6a24mp5aspciaa5nzxssjypba52qrtqlmjq
{
  ALTER TYPE default::Notification {
      DROP PROPERTY title;
  };
};
