import React from "react";
import {
  AvatarProps,
  Text,
  chakra,
  useMultiStyleConfig,
  Skeleton,
  Tooltip,
} from "@chakra-ui/react";
import Image from "next/image";
import { getImageUri } from "@/utils/helpers";
import { User } from "react-feather";

function getInitials(name: string) {
  const [firstName, lastName] = name.split(" ");
  return firstName && lastName
    ? `${firstName.charAt(0)}${lastName.charAt(0)}`
    : firstName.charAt(0);
}

interface CustomAvatarProps extends AvatarProps {
  tooltip?: string;
}

const Avatar = React.forwardRef(
  (props: CustomAvatarProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { name, src, tooltip, showBorder, ...boxProps } = props;

    const initials = React.useMemo(() => getInitials(name ?? ""), [name]);
    const [imageUnavailable, setImageUnavailable] = React.useState(!src);
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const styles = useMultiStyleConfig("Avatar", props);
    const [hasRendered, setHasRendered] = React.useState(false);
    const imgRef = React.useRef<HTMLImageElement | null>(null);

    React.useEffect(() => {
      if (src) setImageUnavailable(false);
      if (imgRef.current && hasRendered) {
        imgRef.current.src = src || "";
      }
    }, [src, hasRendered]);

    React.useEffect(() => {
      setHasRendered(true);
    }, []);

    const avatar = (
      <chakra.span
        ref={ref}
        flex="none"
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        borderRadius="100%"
        height="50px"
        width="50px"
        background="gray.200"
        overflow="hidden"
        {...boxProps}
        borderWidth={showBorder ? "2px" : undefined}
      >
        {(imageUnavailable || !src) && (
          <Text textTransform="uppercase" fontWeight="500" __css={styles.label}>
            {initials}
          </Text>
        )}
        {(imageUnavailable || !src) && !initials && <User />}
        {src && !imageLoaded && !imageUnavailable && (
          <Skeleton w="100%" h="100%" />
        )}
        {!imageUnavailable && src && (
          <Image
            // priority
            ref={imgRef}
            // unoptimized
            objectFit="cover"
            src={getImageUri(src)}
            alt=""
            layout="fill"
            onError={() => setImageUnavailable(true)}
            onLoad={() => setImageLoaded(true)}
          />
        )}
      </chakra.span>
    );

    if (tooltip) return <Tooltip label={tooltip}>{avatar}</Tooltip>;

    return avatar;
  }
);

Avatar.displayName = "Avatar";

export default Avatar;
