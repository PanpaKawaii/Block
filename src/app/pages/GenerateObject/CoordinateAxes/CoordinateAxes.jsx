import React from 'react';
import './CoordinateAxes.css';

export default function CoordinateAxes({ width = 800, height = 40, styleObj }) {
    return (
        <div className='coordinate-axes-container' style={styleObj}>
            {[
                { name: 'x', type: 'color', color: '#FF0000' },
                { name: 'x', type: 'white', color: '#FFFFFF' },
                { name: 'y', type: 'color', color: '#00FF00' },
                { name: 'y', type: 'white', color: '#FFFFFF' },
                { name: 'z', type: 'color', color: '#0000FF' },
                { name: 'z', type: 'white', color: '#FFFFFF' },
            ].map((axe) => (
                <React.Fragment key={`${axe.name}-${axe.type}`}>
                    <svg
                        className={`face-axes line-${axe.name} ${axe.type}`}
                        width={`${width || '0'}`}
                        height={`${height || '0'}`}
                        viewBox={`0 0 ${width || '0'} ${height || '0'}`}
                    >
                        {/* <defs>
                        <filter
                            id={`glow-${axe.name}-${axe.type}`}
                            x='-60%'
                            y='-60%'
                            width='220%'
                            height='220%'
                        >
                            <feGaussianBlur stdDeviation='4' result='blur' />
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in='SourceGraphic' />
                            </feMerge>
                        </filter>
                    </defs> */}
                        <path
                            d={`M 2 ${height / 2 - 1} L ${width - 2} ${height / 2 - 1} L ${width - 2} ${height / 2 + 1} L 2 ${height / 2 + 1} Z`}
                            fill={axe.color}
                            stroke='#FFFFFF'
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
                    {axe.type == 'color' && <i className={`fa-solid fa-rotate-right arrow arrow-${axe.name}`} style={{ '--width': `${width * 9 / 20}px` }} />}
                </React.Fragment>
            ))}
        </div>
    )
}
