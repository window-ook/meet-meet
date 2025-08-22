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
    quality?: number;
    placeholder?: 'blur' | 'empty';
}

export default function ImageWithFallback(props: ImageWithFallbackProps) {
    const { src, fallbackSrc, alt, width, height, className, priority = false, quality = 75, placeholder = 'blur', ...rest } = props;

    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            {...rest}
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => {
                console.log('이미지 로드 실패 => fallback 이미지 적용');
                setImgSrc(fallbackSrc)
            }}
            width={width}
            height={height}
            priority={priority}
            fetchPriority={priority ? 'high' : 'auto'}
            loading={priority ? 'eager' : 'lazy'}
            crossOrigin=""
            decoding={priority ? 'sync' : 'async'}
            quality={quality}
            placeholder={placeholder}
            blurDataURL={placeholder === 'blur' ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+" : undefined}
            unoptimized={false}
        />
    );
};