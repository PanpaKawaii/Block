import React from 'react';
import './CoordinateAxes.css';

export default function CoordinateAxes({
    width = 800,
    height = 40,
    styleObj
}) {
    return (
        <div className='coordinate-axes-container' style={styleObj}>
            {[
                { name: 'x', type: 'color', color: '#FF0000' },
                // { name: 'x', type: 'white', color: '#68FCFF' },
                { name: 'y', type: 'color', color: '#00FF00' },
                // { name: 'y', type: 'white', color: '#68FCFF' },
                { name: 'z', type: 'color', color: '#0000FF' },
                // { name: 'z', type: 'white', color: '#68FCFF' },
            ].map((axe) => (
                <React.Fragment key={`${axe.name}-${axe.type}`}>
                    <svg
                        className={`face-axes line-${axe.name} ${axe.type}`}
                        width={`${width || '0'}`}
                        height={`${height || '0'}`}
                        viewBox={`0 0 ${width || '0'} ${height || '0'}`}
                    >
                        <path
                            d={`M 20 ${height / 2 - 1} L ${width - 2} ${height / 2 - 1} L ${width - 2} ${height / 2 + 1} L 20 ${height / 2 + 1} L 20 28 L 2 ${height / 2 + 1} L 20 12 Z`}
                            fill={axe.color}
                            stroke='#68FCFF'
                            strokeWidth='0.5'
                            vectorEffect='non-scaling-stroke'
                            filter={`url(#glow-${axe.name}-${axe.type})`}
                        />
                        <text
                            x={axe.type == 'white' ? width + 10 : -10}
                            y={height / 2 + 1}
                            textAnchor='middle'
                            dominantBaseline='middle'
                            fill={axe.color}
                            fontSize='16'
                            className='text-svg'
                        >
                            {axe.name.toUpperCase()}
                        </text>
                    </svg>
                    {axe.type == 'color' && <i className={`fa-solid fa-rotate-right arrow arrow-${axe.name}`} style={{ '--width': `${Math.max(20, width / 2 - 30)}px` }} />}
                </React.Fragment>
            ))}
        </div>
    )
}
