// Debug script to clear AsyncStorage and test fresh login
import AsyncStorage from "@react-native-async-storage/async-storage";

export const clearAndTestStorage = async () => {
  try {
    console.log("🧹 Clearing all AsyncStorage data...");
    await AsyncStorage.clear();
    console.log("✅ AsyncStorage cleared");

    // Add some test data
    const testUserData = {
      id: "test_ronal_123",
      email: "ronal@gmail.com",
      firstName: "Ronal",
      lastName: "User",
      name: "Ronal User",
      fullName: "Ronal User",
      accountType: "User",
      userType: "user",
      isEmailVerified: true,
      phone: "+1234567890",
    };

    await AsyncStorage.setItem("userData", JSON.stringify(testUserData));
    await AsyncStorage.setItem("accountType", "User");

    console.log("✅ Test userData stored:", testUserData);

    // Verify storage
    const storedData = await AsyncStorage.getItem("userData");
    const storedAccountType = await AsyncStorage.getItem("accountType");

    console.log("📋 Verification:");
    console.log("- Stored userData:", storedData);
    console.log("- Stored accountType:", storedAccountType);

    if (storedData) {
      const parsed = JSON.parse(storedData);
      console.log("- Parsed name:", parsed.name);
      console.log("- Parsed firstName:", parsed.firstName);
      console.log("- Parsed lastName:", parsed.lastName);
    }
  } catch (error) {
    console.error("❌ Error in storage test:", error);
  }
};

export default clearAndTestStorage;
