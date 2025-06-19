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
            fetchPriority={priority ? 'high' : 'auto'}
            loading={priority ? 'eager' : 'lazy'}
            crossOrigin=""
            decoding={priority ? 'sync' : 'async'}
            quality={priority ? 85 : 75}
            placeholder={priority ? 'empty' : 'blur'}
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
    );
};