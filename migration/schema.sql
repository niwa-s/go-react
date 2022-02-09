drop table if exists articles cascade;
drop table if exists comments;

create table articles (
    id serial primary key,
    title text not null unique,
    content text,
    created_at timestamp not null,
    author text not null
);

create table comments (
    id serial primary key,
    article_id integer not null references articles (id),
    author text not null,
    content text,
    created_at timestamp not null
);