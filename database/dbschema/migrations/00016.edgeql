CREATE MIGRATION m1q7ke4plvmh7kjqwpfurffwzm2sdfma6nwj6vc4bl47xz65rajhpq
    ONTO m13uvdeicyjavolvw6blojvprr632alscyhmmvrlx3qtctqc4f5mza
{
  ALTER TYPE default::Message {
      ALTER LINK sender {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
};
