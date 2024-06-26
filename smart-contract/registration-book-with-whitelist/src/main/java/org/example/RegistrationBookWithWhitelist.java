package org.example;

import score.Address;
import score.Context;
import score.ArrayDB;
import score.annotation.EventLog;
import score.annotation.External;
// import scorex.util.HashMap;

// import java.util.Map;
import java.math.BigInteger;
import java.util.List;

public class RegistrationBookWithWhitelist
{
    /**
     *
     */
    private static final String BOOK_STRING = "book";
    private static final String ADMINS = "admins";
    private final ArrayDB<Address> contractAdmins = Context.newArrayDB(ADMINS, Address.class);
    private static final IterableDictDB<Address, BigInteger> book = new IterableDictDB<>(BOOK_STRING, BigInteger.class, Address.class, false);

    /**
     * The RegistrationBook class represents a book for managing registrations.
     * It provides methods for adding, and retrieving registrations.
     */
    /**
     * Constructs a new RegistrationBook object.
     * This constructor is intentionally left empty.
     */
    public RegistrationBookWithWhitelist() {
        Address owner = Context.getOwner();
        this.contractAdmins.add(owner);
    }

    /**
     * Adds an admin to the list of admins.
     * Only the owner can add an admin.
     * @param admin the address of the admin to add
     * @throws RevertException if the caller is not the owner
     */
    @External
    public void addAdmin(Address admin) {
        Address caller = Context.getCaller();
        if (caller.equals(Context.getOwner())) {
            this.contractAdmins.add(admin);
        } else {
            Context.revert("Only the owner can add an admin.");
        }
    }

    @External(readonly=true)
    public List<Address> getAdmins() {
        int size = this.contractAdmins.size();
        Address[] admins = new Address[size];
        for (int i = 0; i < size; i++) {
            admins[i] = this.contractAdmins.get(i);
        }
        return List.of(admins);
    }
    /**
     * Checks if a user is registered in the registration book.
     *
     * @param user the address of the user to check
     * @return "true" if the user is registered, "false" otherwise
     */
    @External(readonly=true)
    public String isUserRegistered(Address user) {
        return book.get(user) != null ? "true" : "false";
    }

    /**
        * Retrieves the registration block of a user.
        *
        * @param user the address of the user
        * @return the registration block as an integer
        */
    @External(readonly=true)
    public BigInteger getUserRegistrationBlock(Address user) {
        return book.get(user);
    }

    @External(readonly=true)
    public int getNumberOfUsers() {
        return book.size();
    }

    @External(readonly=true)
    public List<Address> getUsersList() {
        return book.keys();
    }

    // @External(readonly=true)
    // public Map<String, BigInteger> getUsers() {
    //     Map<String, BigInteger> bookMap = new HashMap<>();
    //     for (Address address : book.keys()) {
    //         bookMap.put(address.toString(), book.getOrDefault(address, BigInteger.ZERO));
    //     }
    //     return bookMap;
    // }

    /**
     * Registers a user in the registration book.
     *
     * @param user The address of the user to register.
     */
    @External
    public void registerUser(Address user) {
        Address caller = Context.getCaller();
        Boolean isAdmin = false;
        int size = this.contractAdmins.size();
        for (int i = 0; i < size; i++) {
            if (caller.equals(this.contractAdmins.get(i))) {
                isAdmin = true;
                break;
            }
        }
        if (isAdmin == false) {
            Context.revert("Only the owner or an admin can register the user.");
        }
        long block = Context.getBlockHeight();
        BigInteger blockBigInt = BigInteger.valueOf(block);
        book.set(user, blockBigInt);
        UserRegistered(user, blockBigInt);
    }

    @EventLog(indexed=2)
    public void UserRegistered(Address user, BigInteger block) {}
}
