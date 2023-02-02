CREATE MIGRATION m1tf3643ro4hsplbfoodkib74rh2hoelhlegl6al5u4xde3l74fowa
    ONTO m1tsgtbiggsbt2fnprgbdla3rqxilpdzacm6t5naf6w7dax2gheexq
{
  ALTER TYPE default::accountCreation RENAME TO default::Account_Creation;
  ALTER TYPE default::passwordReset RENAME TO default::Password_Reset;
};
