CREATE MIGRATION m1tsgtbiggsbt2fnprgbdla3rqxilpdzacm6t5naf6w7dax2gheexq
    ONTO m1iz7knwpn5lrrk5u2jkjhhgq33xydqyfzb2vivfxe2hczyd5gyica
{
  CREATE TYPE default::accountCreation {
      CREATE REQUIRED PROPERTY email -> std::str;
      CREATE REQUIRED PROPERTY password -> std::str;
      CREATE REQUIRED PROPERTY token -> std::str;
      CREATE REQUIRED PROPERTY username -> std::str;
  };
  CREATE TYPE default::passwordReset {
      CREATE REQUIRED PROPERTY email -> std::str;
      CREATE REQUIRED PROPERTY token -> std::str;
  };
};
