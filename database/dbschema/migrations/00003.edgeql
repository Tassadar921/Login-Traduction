CREATE MIGRATION m1vq3cgwqpfzpolufkguovu7j66pswtnipxxyrn2h5lmy4yqoccyaq
    ONTO m1hcicftwa4bl7xuxwpoauitdbex3rso55tjkwt75r4gynk3n4i4cq
{
  ALTER TYPE default::User {
      CREATE LINK permission -> default::Permission;
  };
};
