import React from 'react';
import Main from './Main';
import {createRoot} from "react-dom/client";

const renderReactComponent = (container) => {
    const containerName = container.getAttribute('data-react-container');

    import(`./react/containers/${containerName}.jsx`).then(containerComponentModule => {
        const ContainerComponent = containerComponentModule.default;

        let props = { key: containerName };

        const dataProps = container.getAttribute('data-react-props');
        if (dataProps) {
            props = { ...props, ...JSON.parse(dataProps) };
        }

        createRoot(container).render(
            <Main {...props}>
                <ContainerComponent {...props} />
            </Main>
        );
    }).catch(error => {
        console.error(`Error loading component ${containerName}:`, error);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('[data-react-container]');
    containers.forEach((container) => {
        renderReactComponent(container);
    });
});
