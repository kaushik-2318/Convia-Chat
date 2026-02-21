function path(root, sublink) {
    return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/';

export const PATH_DASHBOARD = {
    root: '/',
    general: {
        app: path('/', 'app'),
    },
};

export const PATH_AUTH = {
    root: ROOTS_DASHBOARD,
    general: {
        welcome: path(ROOTS_DASHBOARD, 'auth/welcome'),
    },
};

export const PATH_DOCS = {
    root: '/',
    general: {
        tnc: path('/', 'docs/tnc'),
    },
};
