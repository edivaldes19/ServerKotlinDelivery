DROP TABLE IF EXISTS roles CASCADE;

CREATE TABLE roles(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    image VARCHAR NULL,
    route VARCHAR NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL
);

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users(
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    name VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    phone VARCHAR NOT NULL UNIQUE,
    image VARCHAR NULL,
    password VARCHAR NOT NULL,
    is_available BOOLEAN NULL,
    session_token VARCHAR NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL
);

DROP TABLE IF EXISTS user_has_roles CASCADE;

CREATE TABLE user_has_roles (
    id_user BIGSERIAL NOT NULL,
    id_rol BIGSERIAL NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_user) REFERENCES users(id) ONUPDATE CASCADE ON
DELETE CASCADE,
    FOREIGN KEY(id_rol) REFERENCES roles(id) ONUPDATE CASCADE ON
DELETE CASCADE,
    PRIMARY KEY(id_user, id_rol)
);

SELECT
    *
FROM
    users;

INSERT INTO
    users(
        email,
        name,
        lastname,
        phone,
        password,
        created_at,
        updated_at
    )
VALUES
    (
        'recio-manuel@outlook.com',
        'Manuel',
        'Valdes',
        '4521314122',
        '17040053',
        '1999-12-19',
        '2021-12-19'
    );

INSERT INTO
    users(
        email,
        name,
        lastname,
        phone,
        image,
        password,
        created_at,
        updated_at
    )
VALUES
    ($ 1, $ 2, $ 3, $ 4, $ 5, $ 6, $ 7) RETURNING id;

SELECT
    id,
    email,
    name,
    lastname,
    phone,
    image,
    password,
    session_token
FROM
    users
WHERE
    email = $ 1
SELECT
    id,
    email,
    name,
    lastname,
    phone,
    image,
    password,
    session_token
FROM
    users
WHERE
    id = 1;

INSERT INTO
    roles(name, route, image, created_at, updated_at)
VALUES
    (
        'CLIENTE',
        'client/home',
        'https://www.pngrepo.com/png/102030/180/user.png',
        '2021-12-19',
        '2010-12-19'
    );

INSERT INTO
    roles(name, route, image, created_at, updated_at)
VALUES
    (
        'RESTAURANTE',
        'restaurant/home',
        'https://www.pngrepo.com/png/234631/180/restaurant-store.png',
        '2021-12-12',
        '2010-12-12'
    );

INSERT INTO
    roles(name, route, image, created_at, updated_at)
VALUES
    (
        'REPARTIDOR',
        'delivery/home',
        'https://www.pngrepo.com/png/192580/180/delivery-man-box.png',
        '2021-12-17',
        '2010-12-17'
    );

INSERT INTO
    user_has_roles (id_user, id_rol, created_at, updated_at)
VALUES
    ($ 1, $ 2, $ 3, $ 4);

SELECT
    U.id,
    U.email,
    U.name,
    U.lastname,
    U.phone,
    U.image,
    U.password,
    U.session_token,
    json_agg(
        json_build_object(
            'id',
            r.id,
            'name',
            r.name,
            'image',
            r.image,
            'route',
            r.route
        )
    ) AS roles
FROM
    users AS U
    INNER JOIN user_has_roles AS uhr ON uhr.id_user = U.id
    INNER JOIN roles AS r ON r.id = uhr.id_rol
WHERE
    U.email = $ 1
GROUP BY
    U.id;

UPDATE
    users
SET
    name = $ 2,
    lastname = $ 3,
    phone = $ 4,
    image = $ 5,
    updated_at = $ 6
WHERE
    id = $ 1;

DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE categories(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    image VARCHAR NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL
);

INSERT INTO
    categories(name, image, created_at, updated_at)
VALUES
    ($ 1, $ 2, $ 3, $ 4) RETURNING id;

SELECT
    id,
    name,
    image
FROM
    categories
ORDER BY
    name;

DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(180) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    price DECIMAL DEFAULT 0,
    image1 VARCHAR(255) NULL,
    image2 VARCHAR(255) NULL,
    image3 VARCHAR(255) NULL,
    id_category BIGSERIAL NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_category) REFERENCES categories(id) ONUPDATE CASCADE ON
DELETE CASCADE
);

INSERT INTO
    products(
        name,
        description,
        price,
        image1,
        image2,
        image3,
        id_category,
        created_at,
        updated_at
    )
VALUES
    ($ 1, $ 2, $ 3, $ 4, $ 5, $ 6, $ 7, $ 8, $ 9) RETURNING id;

UPDATE
    products
SET
    name = $ 2,
    description = $ 3,
    price = $ 4,
    image1 = $ 5,
    image2 = $ 6,
    image3 = $ 7,
    id_category = $ 8,
    updated_at = $ 9
WHERE
    id = $ 1;

SELECT
    P.id,
    P.name,
    P.description,
    P.price,
    P.image1,
    P.image2,
    P.image3,
    P.id_category
FROM
    products AS P
    INNER JOIN categories AS C ON P.id_category = C.id
WHERE
    C.id = 3;

DROP TABLE IF EXISTS address CASCADE;

CREATE TABLE address (
    id BIGSERIAL PRIMARY KEY,
    id_user BIGSERIAL NOT NULL,
    address VARCHAR NOT NULL,
    suburb VARCHAR NOT NULL,
    latitude DECIMAL DEFAULT 0,
    longitude DECIMAL DEFAULT 0,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_user) REFERENCES users(id) ONUPDATE CASCADE ON
DELETE CASCADE
);

INSERT INTO
    address(
        id_user,
        address,
        suburb,
        latitude,
        longitude,
        created_at,
        updated_at
    )
VALUES
    ($ 1, $ 2, $ 3, $ 4, $ 5, $ 6, $ 7) RETURNING id;

SELECT
    id,
    id_user,
    address,
    suburb,
    latitude,
    longitude
FROM
    address
WHERE
    id_user = 1;

DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders(
    id BIGSERIAL PRIMARY KEY,
    id_client BIGSERIAL NOT NULL,
    id_delivery BIGINT NULL,
    id_address BIGSERIAL NOT NULL,
    latitude DECIMAL DEFAULT 0,
    longitude DECIMAL DEFAULT 0,
    status VARCHAR NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_client) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_delivery) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_address) REFERENCES address(id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS order_has_products CASCADE;

CREATE TABLE order_has_products(
    id_order BIGSERIAL NOT NULL,
    id_product BIGSERIAL NOT NULL,
    amount BIGINT NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    PRIMARY KEY(id_order, id_product),
    FOREIGN KEY(id_order) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_product) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO
    orders(
        id_client,
        id_address,
        status,
        timestamp,
        created_at,
        updated_at
    )
VALUES
    ($ 1, $ 2, $ 3, $ 4, $ 5, $ 6) RETURNING id;

INSERT INTO
    order_has_products(
        id_order,
        id_product,
        amount,
        created_at,
        updated_at
    )
VALUES
    ($ 1, $ 2, $ 3, $ 4, $ 5);

SELECT
    O.id,
    O.id_client,
    O.id_address,
    O.id_delivery,
    O.status,
    O.latitude,
    O.longitude,
    O.timestamp,
    json_agg(
        json_build_object(
            'id',
            P.id,
            'name',
            P.name,
            'description',
            P.description,
            'price',
            P.price,
            'image1',
            P.image1,
            'image2',
            P.image2,
            'image3',
            P.image3,
            'amount',
            OHP.amount
        )
    ) AS products,
    json_build_object(
        'id',
        U.id,
        'name',
        U.name,
        'lastname',
        U.lastname,
        'image',
        U.image
    ) AS client,
    json_build_object(
        'id',
        A.id,
        'address',
        A.address,
        'suburb',
        A.suburb,
        'latitude',
        A.latitude,
        'longitude',
        A.longitude
    ) AS address
FROM
    orders AS O
    INNER JOIN users as U ON O.id_client = U.id
    INNER JOIN address as A ON A.id = O.id_address
    INNER JOIN order_has_products AS OHP ON OHP.id_order = O.id
    INNER JOIN products AS P ON P.id = OHP.id_product
WHERE
    O.id_client = $ 1
    AND status = $ 2
GROUP BY
    O.id,
    U.id,
    A.id;

SELECT
    U.id,
    U.email,
    U.name,
    U.lastname,
    U.phone,
    U.image,
    U.password,
    U.session_token
FROM
    users AS U
    INNER JOIN user_has_roles AS UHR ON UHR.id_user = U.id
    INNER JOIN roles AS R ON R.id = UHR.id_rol
WHERE
    R.id = 3;