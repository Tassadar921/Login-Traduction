CREATE MIGRATION m1s2lhthbc67eb43spe3uwou4j7v7sm5we3t3n7bztzgzpyh7azccq
    ONTO m127wvbn3lhtb5eyzhd3vf3mcvbr6i7mprq2ctfmkuoi7y4z77zjxa
{
  CREATE ABSTRACT TYPE default::Subject;
  ALTER TYPE default::Message EXTENDING default::Subject LAST;
  ALTER TYPE default::User EXTENDING default::Subject LAST;
  ALTER TYPE default::Notification {
      CREATE LINK object -> default::Subject {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  ALTER TYPE default::Notification {
      DROP LINK objectMessage;
  };
  ALTER TYPE default::Notification {
      DROP LINK objectUser;
  };
};
