import styled from 'styled-components'

export const ContentContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  padding-bottom: 5px;
`

export const SectionSubtitle = styled.div`
  display: flex;
  font-size: 12px;
  color: #515151;
  font-weight: bold;
  justify-content: flex-start;
`

export const Button = styled.button`
  flex-grow: 1;
  display: flex;
  border: 0px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  height: 55px;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
`
