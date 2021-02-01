drop table if exists normas;

create table normas (
    id int,
    codigo varchar(256),
    titulo nvarchar(512),
    objetivo nvarchar(2048),
    ics varchar(256),
    palavrasChave nvarchar(512),
    filename varchar(256)
);
