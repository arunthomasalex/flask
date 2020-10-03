import React from 'react';

export function Target({ targets }) {
    const leftCol = {width: '50%', position: 'absolute'};
    const rightCol = {width: '50%', position: 'inherit', marginLeft: '125px'};
    return targets.map((target, i) => {
        const key = target.key + "_1";
        return (
        <div key={key} style={ ((i % 2 == 0) ? leftCol : rightCol) }>
            <label style={{display: 'block', background: 'chartreuse', borderRadius: '5px', width: 'max-content'}}>{target.label}</label>
            { ((target) => <span style={{marginLeft: '10px'}}>{ target.value }</span>)(target) }
        </div>);
    });

}