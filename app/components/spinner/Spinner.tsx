import ball from '~/assets/icons/ball.svg'

type SpinnerProps = {
    className?:string
}

const Spinner = ({className}:SpinnerProps) => (
    <img
        src={ball}
        alt="Loading ..."
        className={className ?? 'w-6 h-6 animate-spin'}
    />
)

export default Spinner