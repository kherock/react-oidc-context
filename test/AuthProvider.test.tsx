import { UserManager, User } from "oidc-client"
import { act} from "@testing-library/react"
import { renderHook } from "@testing-library/react-hooks"
import { mocked } from "ts-jest/utils"

import { useAuth } from "../src/useAuth"
import { createWrapper } from "./helpers"

const userManagerMock = mocked(new UserManager({ client_id: "" }))
const user = { id_token: "__test_user__" } as User

describe("AuthProvider", () => {
    it("should signinRedirect when asked", async () => {
        // arrange
        const wrapper = createWrapper()
        const { waitForNextUpdate, result } = renderHook(() => useAuth(), {
            wrapper,
        })
        await waitForNextUpdate()
        expect(result.current.user).toBeUndefined()

        // act
        await act(async () => {
            result.current.signinRedirect()
        })

        // assert
        expect(userManagerMock.signinRedirect).toHaveBeenCalled()
        expect(userManagerMock.getUser).toHaveBeenCalled()
    })

    it("should handle signinCallback success and call onSigninCallback", async () => {
        // arrange
        const onSigninCallback = jest.fn()
        window.history.pushState(
            {},
            document.title,
            "/?code=__test_code__&state=__test_state__"
        )
        expect(window.location.href).toBe(
            "https://www.example.com/?code=__test_code__&state=__test_state__"
        )

        const wrapper = createWrapper({ onSigninCallback })

        // act
        const { waitForNextUpdate } = renderHook(() => useAuth(), {
            wrapper,
        })
        await waitForNextUpdate()

        // assert
        expect(userManagerMock.signinCallback).toHaveBeenCalled()
        expect(onSigninCallback).toHaveBeenCalled()
    })

    it("should handle signinCallback errors and call onSigninCallback", async () => {
        // arrange
        const onSigninCallback = jest.fn()
        window.history.pushState(
            {},
            document.title,
            "/?error=__test_error__&state=__test_state__"
        )
        expect(window.location.href).toBe(
            "https://www.example.com/?error=__test_error__&state=__test_state__"
        )

        const wrapper = createWrapper({ onSigninCallback })

        // act
        const { waitForNextUpdate } = renderHook(() => useAuth(), {
            wrapper,
        })
        await waitForNextUpdate()

        // assert
        expect(userManagerMock.signinCallback).toHaveBeenCalled()
        expect(onSigninCallback).toHaveBeenCalled()
    })

    it("should handle removeUser and call onRemoveUser", async () => {
        // arrange
        const onRemoveUser = jest.fn()

        const wrapper = createWrapper({ onRemoveUser })
        const { waitForNextUpdate, result } = renderHook(() => useAuth(), {
            wrapper,
        })
        await waitForNextUpdate()

        // act
        await act(async () => {
            result.current.removeUser()
        })

        // assert
        expect(userManagerMock.removeUser).toHaveBeenCalled()
        expect(onRemoveUser).toHaveBeenCalled()
    })

    it("should handle signoutRedirect and call onSignoutRedirect", async () => {
        // arrange
        const onSignoutRedirect = jest.fn()
        const wrapper = createWrapper({ onSignoutRedirect })
        const { waitForNextUpdate, result } = renderHook(() => useAuth(), {
            wrapper,
        })
        await waitForNextUpdate()

        // act
        await act(async () => {
            result.current.signoutRedirect()
        })

        // assert
        expect(userManagerMock.signoutRedirect).toHaveBeenCalled()
        expect(onSignoutRedirect).toHaveBeenCalled()
    })

    it("should handle signoutPopup and call onSignoutPopup", async () => {
        // arrange
        const onSignoutPopup = jest.fn()
        const wrapper = createWrapper({ onSignoutPopup })
        const { waitForNextUpdate, result } = renderHook(() => useAuth(), {
            wrapper,
        })
        await waitForNextUpdate()

        // act
        await act(async () => {
            result.current.signoutPopup()
        })

        // assert
        expect(userManagerMock.signoutPopup).toHaveBeenCalled()
        expect(onSignoutPopup).toHaveBeenCalled()
    })

    it("should get the user", async () => {
        // arrange
        userManagerMock.getUser.mockResolvedValue(user)
        const wrapper = createWrapper()

        // act
        const { waitForNextUpdate, result } = renderHook(() => useAuth(), {
            wrapper,
        })
        await waitForNextUpdate()

        // assert
        expect(result.current.user).toBe(user)
      })
})
