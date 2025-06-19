'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
    src: string;
    fallbackSrc: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
}

export default function ImageWithFallback(props: ImageWithFallbackProps) {
    const { src, fallbackSrc, alt, width, height, className, priority = false, ...rest } = props;

    const [imgSrc, setImgSrc] = useState(src);

    return (
        <>
            <Image
                {...rest}
                src={imgSrc}
                alt={alt}
                onError={() => {
                    console.log('이미지 로드 실패 => fallback 이미지 적용');
                    setImgSrc(fallbackSrc)
                }}
                width={width}
                height={height}
                className={className}
                priority={priority}
                sizes="(max-width: 401px) 280px, (max-width: 580px) 280px, (max-width: 801px) 280px, 280px"
            />
        </>
    );
};