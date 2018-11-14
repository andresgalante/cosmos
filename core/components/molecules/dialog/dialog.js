import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from '../../atoms/button'
import ButtonGroup from '../../molecules/button-group'
import Overlay from '../../atoms/_overlay'
// import Icon from '../../atoms/icon'
// import Link from '../../atoms/link'
import DialogAction from './dialog-action'
import { colors, fonts, spacing } from '@auth0/cosmos-tokens'
import Automation from '../../_helpers/automation-attribute'

const createButtonForAction = (action, index) => {
  // As we also support passing raw <Button> components
  // as actions, we only need to create buttons for actions
  // when the action is instance of DialogAction.
  if (!(action instanceof DialogAction)) {
    if (action.displayName !== Button.displayName) {
      throw new Error('Invalid action component passed to Dialog.')
    }

    /* Add index to the button component as a key prop */
    return React.cloneElement(action, { key: index })
  }

  const buttonProps = {
    onClick: action.handler,
    appearance: action.appearance
  }
  return (
    <Button key={index} {...buttonProps}>
      {action.label}
    </Button>
  )
}

const Dialog = props => (
  <Overlay {...props}>

    {/* Can I change this name to DialogBox? */}
    <DialogBox
      width={props.width}
      {...Automation('dialog')}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"

      // only when it's just text
      aria-describedby="dialog-description"
    >
      <DialogClose>

        {/* We needto make this icon better */}
        <Button aria-label="Close" size="default" appearance="action" icon="close" onClick={props.onClose}>
        </Button>

        {/* <Link >
          <Icon name="close" size={16} />
        </Link> */}
      </DialogClose>

      <DialogHeader {...Automation('dialog.title')}>
        <DialogTitle id="dialog-title">
          {props.title}
        </DialogTitle>
      </DialogHeader>

      <DialogBody
        id="dialog-description"
        {...Automation('dialog.body')}>
        {props.children}
      </DialogBody>

      <DialogFooter {...Automation('dialog.footer')}>
        <ButtonGroup>{props.actions.map(createButtonForAction)}</ButtonGroup>
      </DialogFooter>

    </DialogBox>
  </Overlay>
)

const DialogBox = styled.div`
  position: relative;

  /* Max width makes it responsive, no need for media queries */
  max-width: ${props => props.width}px;
  max-height: calc(100vh - ${spacing.xlarge});
  margin-right: ${spacing.small};
  margin-left: ${spacing.small};
  display: flex;
  flex-direction: column;
  background-color: ${colors.base.white};
  border-radius: 3px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
`

const DialogClose = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`

const DialogHeader = styled.header`
  position: relative;
  padding: ${spacing.small} ${spacing.large} ${spacing.xsmall} ${spacing.large};
  color: ${colors.text.default};
  word-break: break-word;

  /* Making the text center on the header is very opiniated */
  text-align: center;

  /* Creates a small fade for the scrolling body */
  ::after {
    content: "";
    position: absolute;
    bottom: -${spacing.large} ;
    left: 0;
    width: 100%;
    height: ${spacing.large};
    background-image: linear-gradient(to bottom, white, transparent);
  }

`

// The author should be able to change the header level 
const DialogTitle = styled.h1`
  font-weight: ${fonts.weight.medium};
  }
`

const DialogBody = styled.div`
  padding: ${spacing.small} ${spacing.medium} ${spacing.large} ${spacing.medium};
  flex: 1 1 auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  word-break: break-word;

  /* Clears the margin of the last item of the body */
  > * {
    margin-bottom: 0;
  }
`

const DialogFooter = styled.footer`
  display: flex;
  flex: 0 0 auto;
  justify-content: center;
  padding: ${spacing.small};
  border-top: 1px solid ${colors.base.grayLight};
`

Dialog.Action = DialogAction
Dialog.Element = DialogBox

Dialog.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.instanceOf(DialogAction), PropTypes.element])
  ).isRequired,
  title: PropTypes.string.isRequired,
  width: PropTypes.number,
  onClose: PropTypes.func
}

Dialog.defaultProps = {
  width: 500
}

export default Dialog
